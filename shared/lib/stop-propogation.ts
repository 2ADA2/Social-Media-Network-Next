import { MouseEvent } from "react";

export default function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}
