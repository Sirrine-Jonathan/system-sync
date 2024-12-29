import { NavLink } from "@remix-run/react";
import { calendar_v3 } from "googleapis";

const colorIdMap: { [key: string]: string } = {
  1: "red",
  2: "blue",
  3: "green",
  4: "yellow",
  5: "orange",
  6: "purple",
  7: "pink",
  8: "brown",
  9: "white",
  10: "orchid",
  11: "gray",
  12: "cyan",
  13: "magenta",
  14: "yellow",
  15: "olive",
  16: "teal",
  17: "navy",
  18: "maroon",
  19: "var(--accent-color)",
  20: "silver",
  21: "violet",
  22: "indigo",
  23: "turquoise",
  24: "lime",
  25: "aqua",
  26: "fuchsia",
  27: "orchid",
  28: "crimson",
  29: "teal",
  30: "chartreuse",
};
export const EventDot = ({ event }: { event: calendar_v3.Schema$Event }) => {
  return (
    <NavLink
      to={`/event/${event.id}`}
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: event.colorId
          ? `${colorIdMap[event.colorId]}`
          : "black",
      }}
    />
  );
};
