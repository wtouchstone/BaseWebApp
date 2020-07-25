export default class Ranking {
    iterationNumber = 0;
    songArray = [];
    currentPair = [];

    constructor(songArray) {
        this.songArray = songArray;
        this.songArray.sort(() => Math.random() - 0.5);
        console.log(this.songArray[0].track.artists[0]);
        this.currentPair = [songArray[0], songArray[1], 0, 1]
        console.log("const");
    }


    

    update(choice) {
        var leftInd = this.currentPair[3];
        var rightInd = this.currentPair[4];
        if (choice == 0) {
            swap(leftInd, rightInd);
            if (rightInd == this.songArray.length() - this.iterationNumber) {
                reset();
                return;
            } else {
                newCurrentPair = [this.currentPair[0], this.songArray[rightInd + 1], leftInd, rightInd + 1];
            }
        } else if (choice == 1) {
            if (rightInd == this.songArray.length() - this.iterationNumber) {
                reset();
                return;
            }
            newCurrentPair = [this.currentPair[1], this.songArray[rightInd + 1], rightInd, rightInd + 1];
        }
    }

    reset() {
        this.currentPair = [this.songArray[0], this.songArray[1], 0, 1];
    }

    swap(index1, index2) {
        var temp = this.songArray[index1];
        this.songArray[index1] = this.songArray[index2];
        this.songArray[index2] = temp;
    }

    getOptions() {
        return this.currentPair;
    }



}
