//seperated from routes and app startup to keep responsibilities clear.
import { Request, Response, NextFunction } from "express";
import { Collection } from "mongodb";
import { getCollection } from "../db/connect.js";

//minimal typing for the expected document shape stored in 'config' collection
interface ConfigDoc {
  _id?: any;
  configurationId: string;
  matrix?: any[]; //2D array
  remark?: string;
}

//obtain the collection with proper typing.
function configCollection(): Collection<ConfigDoc> {
  return getCollection<ConfigDoc>("config");
}

//GET controller.(/api/configurations/:id)
//Find documents by `configurationId`(NOT _id)
//If not found: responds with 404 and a message indicating missing config.
export async function getConfigurationById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const configurationId = String(req.params.id || "").trim(); //{id} is dynamic parameter.

    if (!configurationId) {
      //validation
      return res
        .status(400)
        .json({ message: `Missing configuration id in URL` });
      //Bad request
    }

    //function to obtain the collection with proper typing.
    const coll = configCollection();

    //find doc with 'configurationId'.
    const doc = await coll.findOne({ configurationId });

    if (!doc) {
      //Frontend will render "no config with this id:{id}" in red.
      return res
        .status(404)
        .json({ message: `config not found for id:${configurationId}` });
    }

    //if the document contains a matrix array, return it directly.
    if (doc.matrix && Array.isArray(doc.matrix)) {
      return res.status(200).json(doc.matrix);
    }

    //Fallback: return the full document(if matrix is not present).
    return res.status(200).json(doc);
  } catch (error) {
    //centralized error handler decide how to format the error response.
    next(error);
  }
}

//PUT (/api/configurations/:id)
//Body:{remark:string}
//Updates the `remark` field of the specified configuration
//Success -> { message: 'success' }
export async function updateConfigurationRemark(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const configurationId = String(req.params.id || "").trim();
    const { remark } = req.body || {};

    if (!configurationId) {
      return res
        .status(400)
        .json({ message: `Missing configuration id in URL` });
    }

    if (typeof remark !== "string") {
      return res
        .status(400)
        .json({ message: `Invalid request body.Expected {remark:string}` });
    }

    const coll = configCollection();

    const updateResult = await coll.updateOne(
      {
        configurationId,
      },
      { $set: { remark } }
    );

    if (updateResult.matchedCount === 0) {
      //No document matched - frontend will display "config doesnt exist".
      return res
        .status(404)
        .json({ message: `config not found for id:${configurationId}` });
    }

    //Success contract required by assignment
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
}
