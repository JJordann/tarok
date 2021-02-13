
class Sound {

    static playEffects
    static shuffleEffects

    constructor() {
        Sound.playEffects = [
            "/soundEffects/play/play1.wav",
            "/soundEffects/play/play2.wav",
            "/soundEffects/play/play3.wav",
            "/soundEffects/play/play4.wav",
            "/soundEffects/play/play5.wav"
        ].map(f => new Audio(f))

        Sound.shuffleEffects = [
            "/soundEffects/shuffle/shuffle1.wav",
            "/soundEffects/shuffle/shuffle2.mp3",
            "/soundEffects/shuffle/shuffle3.mp3"
        ].map(f => new Audio(f))
    }

    randomPlayEffect = () => {
        let index = Math.floor(Math.random() * Sound.playEffects.length)
        Sound.playEffects[index].play()
    }

    randomShuffleEffect = () => {
        let index = Math.floor(Math.random() * Sound.shuffleEffects.length)
        Sound.shuffleEffects[index].play()
    }
}


var _Sound = null
if (_Sound === null)
    _Sound = new Sound()

export default _Sound