import React from "react";

export default function RatingStars({ value, onChange }: { value:number; onChange:(n:number)=>void }) {
  return (
    <div style={{display:'flex',gap:6}}>
      {Array.from({length:5}).map((_,i)=>{
        const v = i+1;
        return (
          <button key={v} type="button" onClick={()=>onChange(v)} style={{border:0,background:'transparent',cursor:'pointer'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={v<=value ? "#ffd166" : "none"} stroke="#ffd166" strokeWidth="1.2">
              <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.6L19.5 24 12 19.897 4.5 24l1.75-8.65L.5 9.75l7.832-1.732z"/>
            </svg>
          </button>
        );
      })}
    </div>
  );
}
