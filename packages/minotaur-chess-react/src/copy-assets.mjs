import { copy } from "cpx";

copy("./assets/**/*", "./dist/assets", (err) => {
  if (err) {
    console.error("Error copying assets:", err);
  } else {
    console.log("Assets copied successfully!");
  }
});
