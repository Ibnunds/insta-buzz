const { bgWhite } = require("chalk");

module.exports = class ProgressBar {
  constructor() {
    this.total;
    this.current;
    this.bar_length = process.stdout.columns - 30;
    this.completed = false;
  }

  init(total) {
    this.total = total;
    this.current = 0;
    this.completed = false;
    this.update(this.current);
  }

  update(current) {
    if (!this.completed) {
      this.current = current;
      const current_progress = this.current / this.total;
      this.draw(current_progress);

      if (current_progress >= 1) {
        this.completed = true;
        this.clear();
      }
    }
  }

  clear() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  draw(current_progress) {
    if (!this.completed) {
      const filled_bar_length = (current_progress * this.bar_length).toFixed(0);
      const empty_bar_length = this.bar_length - filled_bar_length;

      const filled_bar = this.get_bar(filled_bar_length, " ", bgWhite);
      const empty_bar = this.get_bar(empty_bar_length, "-");
      const percentage_progress = (current_progress * 100).toFixed(2);

      this.clear();

      process.stdout.write(
        `Memposting: [${filled_bar}${empty_bar}] | ${percentage_progress}%`
      );
    }
  }

  get_bar(length, char, color = (a) => a) {
    let str = "";
    for (let i = 0; i < length; i++) {
      str += char;
    }
    return color(str);
  }
};
