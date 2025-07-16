export const getTimestamp = () => {
    const date = new Date();
    const ts = Math.floor(date.getTime() / 1000);
    return ts;
  };