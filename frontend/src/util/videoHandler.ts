// eslint-disable-next-line @typescript-eslint/no-explicit-any
const videoHandler = function (this: any) {
  const range = this.getSelection();
  const value = prompt("please enter youtube url : ");
  if (value) {
    this.insertEmbed(range.index, "video", value, "user");
    this.getSelection(range.index + 1);
  }
};

const modules = {
  toolbar: {
    container: [
      [{ header: "1" }, { header: "2" }, { font: [] }],

      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],

      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],

      ["link", "image", "video"],
      ["clean"],
    ],
  },
};

export { videoHandler, modules };
