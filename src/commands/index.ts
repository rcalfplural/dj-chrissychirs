import { ICommand } from "../InterfaceDefinitions";

import dj from "./dj";
import general from "./general";

export default <ICommand[]>[
    ...dj,
    ...general
];