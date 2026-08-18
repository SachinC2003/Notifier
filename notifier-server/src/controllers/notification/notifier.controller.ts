import { Request, Response } from "express";

/** POST /notify */
export const notifier = async (req:Request, res:Response) => {
    return res.status(410).json({
        message: "This endpoint is deprecated. Use POST /notifications with X-API-Key.",
    });
}

/** GET /notifications */
export const getNotifications = async (req:Request, res:Response) => {
    try{
        
    }catch(err){
        res.status(500).json({ message: "Internal Server Error" });
    }
}
