import { Scene } from 'phaser';
import { loadHighScore, saveHighScore, recordDeath } from '../highScore.js';
import { pickPost, toFontSafe } from '../posts.js';
import { addPanel, addText } from '../UI.js';
import { isTouchDevice } from '../device.js';

// Game over, laid out like ui/mock_gameover.png and run as an overlay on top of the Game scene,
// so the crash site stays visible behind a dim layer.
// Left: result banner, altitude plate, NEW BEST ribbon, Try again button.
// Right: a Shiftter feed of up to MAX_POSTS posts reacting to the crash (posts in posts.js), with
// a Share button under it.

const MARGIN = 8;
const COLUMN_GAP = 16;
const LEFT_W = 200;
const MAX_POSTS = 3;
const POST_GAP = 3;
const INK = 0x16142a;
const MUTED = 0x8b91b5; // ui_paper[4], secondary text on paper
const LIKE_RED = 0xff4f74;
const GOLD = 0xffd25c;
const LABEL_TOP = 4; // button label's first row, see placeLabel
const BUTTON_W = 100;
const BUTTON_H = 18;
const GAME_URL = 'https://arkytex.itch.io/shiftx';

// card layout from ui/manifest.json (shiftter_card_bg), card-local pixels
const CARD = {
    w: 208, avatar: [6, 6], name: [36, 6], badgeGap: 2, handleGap: 4,
    text: [36, 18], textW: 164, minIconsY: 52, iconsX: [36, 80, 124, 168], countOffset: [14, 4]
};
const ICON = { reply: 0, reshift: 1, reshiftActive: 2, like: 3, likeActive: 4, views: 5 };

// banner_for_cause from ui/manifest.json
const BANNER_FOR_OBSTACLE = {
    bird: 'bird_strike', bird_flock: 'bird_strike', drone: 'midair', prop_plane: 'midair',
    airliner: 'midair', hot_air_balloon: 'midair', weather_balloon: 'midair', storm_cloud: 'zapped',
    asteroid_small: 'asteroid', asteroid_medium: 'asteroid', asteroid_large: 'asteroid',
    satellite: 'space_junk', space_junk: 'space_junk'
};

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init (data)
    {
        this.score = data.score || 0;
        this.isNewBest = saveHighScore(this.score);
        this.best = Math.max(loadHighScore(), this.score); // in case storage was blocked
        this.death = data.death || { cause: 'crash', altM: 0, peakM: this.score };
        const deaths = recordDeath();

        // first post reacts to this crash; the rest are more of the timeline (no repeats)
        const ctx = { ...this.death, deaths, best: this.best };
        // each from a different account, so the feed doesn't look like one person spamming
        this.posts = [];
        for (let tries = 0; this.posts.length < MAX_POSTS && tries < 20; tries++)
        {
            const post = pickPost(ctx);
            if (!this.posts.some((p) => p.author === post.author)) this.posts.push(post);
        }
    }

    create ()
    {
        this.dim = this.add.rectangle(0, 0, 1, 1, 0x0b0a18, 0.55).setOrigin(0);

        this.buildLeft();
        this.buildFeed();

        const place = () => this.layout();
        place();
        this.scale.on('resize', place);
        this.events.once('shutdown', () => this.scale.off('resize', place));

        // restarts the Game scene underneath and closes this overlay
        const retry = () => this.scene.start('Game');
        this.retry = retry;
        this.input.keyboard.once('keydown-ENTER', retry);
        this.input.keyboard.once('keydown-SPACE', retry);
        this.input.keyboard.once('keydown-ESC', () => this.toMenu());

        // or both shift keys together. Only fresh presses count, so shifts still held from the
        // crash don't restart the game the moment this screen opens.
        const held = new Set();
        this.input.keyboard.on('keydown-SHIFT', (e) =>
        {
            if (e.repeat) return;
            held.add(e.location);
            if (held.has(1) && held.has(2)) retry();
        });
        this.input.keyboard.on('keyup-SHIFT', (e) => held.delete(e.location));
    }

    // ---- left column ------------------------------------------------------------------------

    buildLeft ()
    {
        const d = this.death;
        const banner = d.cause === 'hit'
            ? BANNER_FOR_OBSTACLE[d.obstacle] || 'crashed'
            : d.cause === 'lost' ? 'lost_balance' : 'crashed';
        this.banner = this.add.image(0, 0, `ui_gameover_banner_${banner}`).setOrigin(0);

        // altitude in the plate's number slot: right edge x 144, y 14, big digits
        this.scorePlate = this.add.image(0, 0, 'ui_gameover_score_plate').setOrigin(0);
        this.scoreText = addText(this, 0, 0, 'shiftx_digits', `${this.score.toLocaleString('en-US')}m`);

        if (this.isNewBest)
        {
            this.ribbon = this.add.sprite(0, 0, 'ui_gameover_new_best_ribbon').setOrigin(0)
                .play('ui_gameover_new_best_ribbon');
        }
        else
        {
            this.bestText = addText(this, 0, 0, 'shiftx_body_outline',
                `Best ${this.best.toLocaleString('en-US')}m`, { tint: GOLD });
        }

        this.tryAgain = this.makeButton('Try again', () => this.retry());
        this.menuButton = this.makeButton('Menu', () => this.toMenu());
        this.clickIcon = this.add.sprite(0, 0, 'ui_kit_click_icon').setOrigin(0).play('ui_kit_click_icon');
        // keyboard shortcut, not much use on a phone (small font is caps only)
        this.retryHint = isTouchDevice()
            ? null
            : addText(this, 0, 0, 'shiftx_small_outline', 'OR PRESS BOTH SHIFTS');
    }

    // back to the start screen: the Game scene is still running underneath, so stop it too
    toMenu ()
    {
        this.scene.stop('Game');
        this.scene.start('MainMenu');
    }

    // Button: one 9-slice per face, only the current one visible; a zone takes the clicks.
    makeButton (text, onClick)
    {
        const button = { faces: {}, face: 'normal' };
        for (const face of ['normal', 'hover', 'pressed'])
        {
            button.faces[face] = addPanel(this, `ui_kit_button_${face}`, 0, 0, BUTTON_W, BUTTON_H).setOrigin(0);
        }
        button.zone = this.add.zone(0, 0, BUTTON_W, BUTTON_H).setOrigin(0).setInteractive({ useHandCursor: true });
        button.label = addText(this, 0, 0, 'shiftx_body', text, { tint: INK });
        const setFace = (face) =>
        {
            button.face = face;
            for (const [name, panel] of Object.entries(button.faces)) panel.setVisible(name === face);
            this.placeLabel(button);
        };
        setFace('normal');
        button.zone.on('pointerover', () => setFace('hover'));
        button.zone.on('pointerout', () => setFace('normal'));
        button.zone.on('pointerdown', () => setFace('pressed'));
        button.zone.on('pointerup', () =>
        {
            setFace('hover');
            onClick();
        });
        return button;
    }

    placeButton (button, x, y)
    {
        button.zone.setPosition(x, y);
        this.placeLabel(button);
    }

    placeLabel (button)
    {
        const b = button.zone;
        for (const panel of Object.values(button.faces)) panel.setPosition(b.x, b.y);
        // the orange face is rows 2..12 of the art (outline and highlight above, side below).
        // shiftx_body caps are rows 0..6 of a glyph, so top row 4 centres them on the face with
        // descenders still inside it. Pressed drops 2 px (label_offset_y in the manifest).
        const glyphs = button.label.getTextBounds(true).local;
        button.label.setPosition(
            Math.round(b.x + b.width / 2 - (glyphs.x + glyphs.width / 2)),
            b.y + LABEL_TOP + (button.face === 'pressed' ? 2 : 0)
        );
    }

    // stacks the left column at (x, y); returns its height
    placeLeft (x, y)
    {
        const cx = Math.round(x + LEFT_W / 2);
        const startY = y;
        const centre = (obj) => obj.setX(Math.round(cx - obj.width / 2));

        centre(this.banner).setY(y);
        y += this.banner.height + 6;
        centre(this.scorePlate).setY(y);
        this.scoreText.setPosition(this.scorePlate.x + 144 - this.scoreText.width, this.scorePlate.y + 14);
        y += this.scorePlate.height + 4;
        const extra = this.ribbon || this.bestText;
        centre(extra).setY(y);
        y += extra.height + 6;

        // button centred in the column; the click hint hangs off its right side
        const bx = Math.round(cx - BUTTON_W / 2);
        this.placeButton(this.tryAgain, bx, y + 4);
        this.clickIcon.setPosition(bx + BUTTON_W + 4, y);
        y += this.clickIcon.height;
        if (this.retryHint)
        {
            centre(this.retryHint).setY(y + 2);
            y += 2 + this.retryHint.height;
        }
        this.placeButton(this.menuButton, bx, y + 6);
        y += 6 + BUTTON_H;
        return y - startY;
    }

    // ---- Shiftter feed ----------------------------------------------------------------------

    buildFeed ()
    {
        this.feedHeader = this.add.image(0, 0, 'ui_gameover_shiftter_feed_header').setOrigin(0);
        const liked = Math.floor(Math.random() * this.posts.length); // one post gets a live like
        this.cards = this.posts.map((post, i) => this.buildCard(post, i === liked));
        this.shareButton = this.makeButton('Share score', () => this.share());
    }

    // Shares the crash post with the score and a link: the phone's share sheet where there is one,
    // otherwise a post composer on X in a new tab.
    share ()
    {
        const post = this.posts[0];
        const score = this.score.toLocaleString('en-US');
        const text = `"${post.text}" - @${post.author.handle}\n\n`
            + `I got my rocket to ${score}m in Shiftoff! You fly it with the two Shift keys. Beat me:`;
        if (navigator.share)
        {
            navigator.share({ title: 'Shiftoff!', text, url: GAME_URL }).catch(() => {});
            return;
        }
        const intent = new URL('https://x.com/intent/post');
        intent.searchParams.set('text', text);
        intent.searchParams.set('url', GAME_URL);
        window.open(intent, '_blank', 'noopener');
    }

    buildCard ({ author, text }, liked)
    {
        const c = this.add.container(0, 0);
        const add = (obj) => { c.add(obj); return obj; };

        // text first, so the card can grow to fit it
        const body = addText(this, CARD.text[0], CARD.text[1], 'shiftx_body', toFontSafe(text), { tint: INK });
        body.setMaxWidth(CARD.textW);
        const iconsY = Math.max(CARD.minIconsY, CARD.text[1] + body.height + 4);
        const h = iconsY + 14;

        add(addPanel(this, 'ui_kit_panel_paper', 0, 0, CARD.w, h).setOrigin(0));
        add(body);
        c.bringToTop(body);
        add(this.buildAvatar(author)).setPosition(...CARD.avatar);

        // name, badge, then "@handle · 3m" shortened to fit the card
        // names in faux bold (drawn twice, 1 px apart) so they stand out from the post text
        const nameText = toFontSafe(author.name);
        add(addText(this, CARD.name[0] + 1, CARD.name[1], 'shiftx_body', nameText, { tint: INK }));
        const name = add(addText(this, CARD.name[0], CARD.name[1], 'shiftx_body', nameText, { tint: INK }));
        let x = name.x + name.width + 1 + CARD.badgeGap;
        if (author.verified)
        {
            add(this.add.image(x, CARD.name[1] - 1, 'ui_gameover_verified_badge').setOrigin(0));
            x += 11;
        }
        x += CARD.handleGap;
        const ago = `${1 + Math.floor(Math.random() ** 2 * 59)}m`;
        const handle = add(addText(this, x, CARD.name[1], 'shiftx_body', `@${author.handle} - ${ago}`, { tint: MUTED }));
        let full = author.handle;
        while (handle.x + handle.width > CARD.w - 6 && full.length > 1)
        {
            full = full.slice(0, -1);
            handle.setText(`@${full}... - ${ago}`);
        }

        // reply / reshift / like / views with counts
        const counts = [
            compact(randomBetween(2, 900)),
            compact(randomBetween(10, 40000)),
            compact(randomBetween(50, 400000)),
            compact(randomBetween(1000, 9000000))
        ];
        const icons = [ICON.reply, ICON.reshift, liked ? ICON.likeActive : ICON.like, ICON.views];
        icons.forEach((frame, i) =>
        {
            const ix = CARD.iconsX[i];
            add(this.add.image(ix, iconsY, 'ui_gameover_shiftter_icons', frame).setOrigin(0));
            const tint = i === 2 && liked ? LIKE_RED : MUTED;
            add(addText(this, ix + CARD.countOffset[0], iconsY + CARD.countOffset[1], 'shiftx_small', counts[i], { tint }));
        });
        if (liked)
        {
            // heart pops a beat after the screen appears, then stays filled
            const pop = add(this.add.sprite(CARD.iconsX[2] + 6, iconsY + 6, 'ui_gameover_like_pop').setVisible(false));
            this.time.delayedCall(500, () => pop.setVisible(true).play('ui_gameover_like_pop'));
            pop.once('animationcomplete', () => pop.destroy());
        }

        return { container: c, h };
    }

    // 24x24 avatar from the sheet, or a generated tile (rounded ink frame, initial) for accounts
    // the sheet doesn't have
    buildAvatar (author)
    {
        if (author.avatar !== undefined)
        {
            return this.add.image(0, 0, 'ui_gameover_avatars', author.avatar).setOrigin(0);
        }
        const tile = this.add.container(0, 0);
        const g = this.add.graphics();
        g.fillStyle(INK).fillRect(1, 0, 22, 24).fillRect(0, 1, 24, 22);
        g.fillStyle(author.color).fillRect(1, 1, 22, 22);
        g.fillStyle(0xffffff, 0.25).fillRect(1, 1, 22, 1).fillRect(1, 1, 1, 22); // lit from upper left
        tile.add(g);
        const letter = addText(this, 0, 0, 'shiftx_body_outline', toFontSafe(author.name).charAt(0).toUpperCase());
        letter.setPosition(Math.round(12 - letter.width / 2), Math.round(12 - letter.height / 2));
        tile.add(letter);
        return tile;
    }

    // ---- layout -----------------------------------------------------------------------------

    layout ()
    {
        const { width, height } = this.scale;
        this.dim.setSize(width, height);

        const leftH = this.placeLeft(0, 0); // measure
        const sideBySide = width >= LEFT_W + COLUMN_GAP + CARD.w + MARGIN * 2;

        let feedX, feedTop, feedBottom;
        if (sideBySide)
        {
            const totalW = LEFT_W + COLUMN_GAP + CARD.w;
            const x0 = Math.round((width - totalW) / 2);
            this.placeLeft(x0, Math.round((height - leftH) / 2));
            feedX = x0 + LEFT_W + COLUMN_GAP;
            feedTop = MARGIN;
            feedBottom = height - MARGIN;
        }
        else
        {
            // narrow screen: left column on top, feed under it
            this.placeLeft(Math.round((width - LEFT_W) / 2), MARGIN);
            feedX = Math.round((width - CARD.w) / 2);
            feedTop = MARGIN + leftH + 10;
            feedBottom = height - MARGIN;
        }

        // as many posts as fit, the crash-specific one first; feed centred vertically in its space
        const shareH = 6 + BUTTON_H;
        let used = this.feedHeader.height + shareH;
        let shown = 0;
        for (const card of this.cards)
        {
            if (used + POST_GAP + card.h > feedBottom - feedTop && shown > 0) break;
            used += POST_GAP + card.h;
            shown++;
        }
        let y = sideBySide ? Math.round(feedTop + (feedBottom - feedTop - used) / 2) : feedTop;
        this.feedHeader.setPosition(feedX, y);
        y += this.feedHeader.height;
        this.cards.forEach((card, i) =>
        {
            card.container.setVisible(i < shown);
            if (i < shown)
            {
                y += POST_GAP;
                card.container.setPosition(feedX, y);
                y += card.h;
            }
        });
        this.placeButton(this.shareButton, Math.round(feedX + CARD.w / 2 - BUTTON_W / 2), y + 6);
    }
}

function randomBetween (min, max)
{
    // skewed low so most posts are mid-sized and the odd one goes properly viral
    return Math.floor(min + (max - min) * Math.random() ** 3);
}

function compact (n)
{
    return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
        .format(n).toUpperCase();
}
