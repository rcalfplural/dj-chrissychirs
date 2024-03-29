import { ICommand } from "../../InterfaceDefinitions";

import ping from "./ping";
import play from "./play";
import queue from "./queue";
import skip from "./skip";
import stop from "./stop";
// import pause from "./pause.old";
import nowplaying from "./nowplaying";

export default <ICommand[]>[ ping, play, skip, stop, queue, nowplaying ];