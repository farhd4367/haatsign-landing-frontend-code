import axios from "axios";
import { installAxiosFallback } from "./apiFallback";

installAxiosFallback(axios);
