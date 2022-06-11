const Utils = {
  getMonthbyNumber: (num) => {
    switch (num) {
      case 1: {
        return "Jan";
      }
      case 2: {
        return "Feb";
      }
      case 3: {
        return "Mar";
      }
      case 4: {
        return "Apr";
      }
      case 5: {
        return "May";
      }
      case 6: {
        return "June";
      }
      case 7: {
        return "July";
      }
      case 8: {
        return "Aug";
      }
      case 9: {
        return "Sept";
      }
      case 10: {
        return "Oct";
      }
      case 11: {
        return "Nov";
      }
      case 12: {
        return "Dec";
      }
      default:
        return null;
    }
  },
  handleError: (err) => {
    console.log(err);
    if (err.code === "INVALID_ARGUMENT") {
      return alert(
        "Given input is not a valid input according to the contract !!"
      );
    }
    if (!err.data) {
      const str = err.message.split(":")[1];
      return alert(str);
    }
    const str = err.data.message.split(":")[2];
    return alert(str);
  },
  shortHash: (hash) => {
    return `${hash.substring(0, 5)}...${hash.substring(
      hash.length - 4,
      hash.length
    )}`;
  },
};

export default Utils;
