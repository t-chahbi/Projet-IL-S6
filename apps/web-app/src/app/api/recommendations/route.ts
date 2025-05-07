import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler (req:NextApiRequest,res:NextApiResponse){
    const {videoId}=req.query ;
    if (!videoId || typeof videoId!=='string'){
        return res.status(400).json({ error: "Missing or invalid videoId" });
    }
    try{
        const youtube =google.youtube({
            version:'v3',
            auth:process.env.YOUTUBE_API_KEY,
        });
        const response=await youtube.search.list({
            part:'snippet', //metadonnée 
            relatedToVideoId:videoId,
            type:'video',
            maxResults:5,
        });
        const results=response.data.items?.map((item)=>({
            title:item?.snippet?.title,
            url:`https://www.youtube.com/watch?v=${item?.id?.videoId}`,
        })) || [];
        return res.json(results);
    } catch (error) {
        console.error('YouTube API error:', error);
        return res.status(500).json({ error: "Failed to fetch recommendations" });
      }
}