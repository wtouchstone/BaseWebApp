class Ranking {
    constructor(songArray) {
        this.songArray = songArray;
        this.songArray.sort(() => Math.random() - 0.5);
        console.log(this.songArray[0].track.artists[0]);
    }
}

modeule.exports = Ranking