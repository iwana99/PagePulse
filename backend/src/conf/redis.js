import { createClient } from "redis";

let redisClient;
export const connectRedis=async(url)=>{
 redisClient= createClient({url});

 redisClient.on("error", (err) => console.error("Redis Client Error", err));
 await redisClient.connect();

 console.log("Redis connected 😎");
 return redisClient;
   
   

}

export const getRedisClient=()=>{
    if(!redisClient) throw new Error("Redis client not connected");
    return redisClient;
}

