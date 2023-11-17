// Workaround for canary React.use() being broken right now,
// should be replaced when the react version is stable.
/* @ts-expect-error no-implicit-any */
export default function use(promise) {
  if (promise.status === "fulfilled") {
    return promise.value;
  } else if (promise.status === "rejected") {
    throw promise.reason;
  } else if (promise.status === "pending") {
    throw promise;
  } else {
    promise.status = "pending";
    promise.then(
      /* @ts-expect-error no-implicit-any */
      (result) => {
        promise.status = "fulfilled";
        promise.value = result;
      },
      /* @ts-expect-error no-implicit-any */
      (reason) => {
        promise.status = "rejected";
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
