export default class InterviewList {
  data = {};
  changedIndexes = [];
  setAllValue;

  set(index, value) {
    this.data[index] = value;
    this.changedIndexes[index] = true;
  }

  get(index) {
    if (this.setAllValue && !this.changedIndexes[index]) {
      return this.setAllValue;
    }
    return this.data[index];
  }

  setAll(value) {
    this.changedIndexes = [];
    this.setAllValue = value;
  }
}
