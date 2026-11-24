import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  Manifests come first: the Preloader reads frame sizes and fps from them to load the sheets.
        this.load.json('launchpad_manifest', 'assets/launchpad/manifest.json');
        this.load.json('obstacles_manifest', 'assets/obstacles/manifest.json');
        this.load.json('effects_manifest', 'assets/effects/manifest.json');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
