

import { Router } from "express";
import {CreateSignature} from '../controllers/UploadController.js'

export const UploadRoute=Router()



UploadRoute.post('/signature',CreateSignature)