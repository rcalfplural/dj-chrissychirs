import { ICommand } from "../../InterfaceDefinitions";

import ping from "./ping";
import play from "./play";
import queue from "./queue";
import skip from "./skip";
import stop from "./stop"

export default <ICommand[]>[ ping, play, queue, skip, stop ];