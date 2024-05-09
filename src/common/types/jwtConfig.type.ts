import { SignOptions } from "jsonwebtoken";

import { JwtTypes } from "../enums";

export type JwtConfigType = { [keys in JwtTypes]: Partial<SignOptions> };
