var redis = require('redis');

export class VPRedis {
  private client : any;

  private static INSTANCE = new VPRedis();

  private constructor(){
    this.client = redis.createClient();
  }

  public static getInstance() : VPRedis {
    return VPRedis.INSTANCE;
  }

  public async get(key : string){
    return new Promise(
      (resolve, reject) => {
          this.client.get(key, (error : any, replay:any) => {
          if(error){
              console.log('Redis Error');
              console.log(error);
              reject();
              return;
          }

          resolve(JSON.parse(replay));
        });
      });
  }

  public async set(key : string, value : any){
    return new Promise(
      (resolve, reject) => {
          this.client.set(key, JSON.stringify(value)), (error : any, replay:any) => {
          if(error){
              console.log('Redis Error');
              console.log(error);
              reject();
              return;
          }

          resolve();
        }
      });
  }

  public async del(key : string){
    return new Promise(
      (resolve, reject) => {
          this.client.del(key), (error : any, replay:any) => {
          if(error){
              console.log('Redis Error');
              console.log(error);
              reject();
              return;
          }

          resolve();
        }
      });
  }

  public async rpush(key : string, value : any){
    return new Promise(
      (resolve, reject) => {
          this.client.rpush(key, JSON.stringify(value), (error : any, replay:any) => {
          if(error){
              console.log('Redis Error');
              console.log(error);
              reject();
              return;
          }

          resolve();
      });
    });
  }

  public async lpop(key : string){
    return new Promise<any>(
      (resolve, reject) => {
        this.client.lpop([key], (error : any, reply : any) => {
          if (error){
            reject();
            return;
          }

          if (reply == null) {
              resolve(null);
              return;
          }
    
          let obj : any = JSON.parse(reply);

          resolve(obj);
        });
      });  
  }

  public async lrange(key : string, start : number, end : number){
    return new Promise(
      (resolve, reject) => {
        this.client.lrange(key, start,end, (error : any, reply : any) => {
          if(error){
            reject();
            return;
          }
    
          resolve(reply);
       });
    }); 
  }
}