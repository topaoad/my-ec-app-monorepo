export function delay(message: string, time: number) {
  return new Promise((resolve, reject) => {
    if (time >= 0) {
      return setTimeout(() => resolve(message), time);
    } else {
      reject(new Error("timeは0以上で指定してください"));
    }
  });
}
