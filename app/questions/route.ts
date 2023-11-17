
import {NextResponse } from "next/server";
import teamBuildingQuestions from "../questions";
export async function GET(req: Request,) {
  const {searchParams} = new URL(req.url);
    // get number of req
    const num = searchParams.get('num')
    if(num){
      // convert to number
      const number = Number(num);
      // validate number is from 1 to 3000
      if (number < 1 || number > 3000) {
    
        return NextResponse.json({ message: 'Invalid number' }, { status: 400 })
      }
      const result = teamBuildingQuestions[number - 1]
      console.log('whats the result', result);
      return NextResponse.json({result: result })
    }else{
      //get length of array
      const length = teamBuildingQuestions.length;
      return NextResponse.json({length: length })
    }
    console.log('whats the search params', searchParams, num)
 
}