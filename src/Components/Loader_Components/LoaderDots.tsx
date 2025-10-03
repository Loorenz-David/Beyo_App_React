import '../../css/loaders.css'

const LoaderDots = ({dotStyle = {dimensions:'squareWidth-07',bgColor:'bg-secondary'},mainBg='#2727278e'}) => {
    return ( 
        <div className="flex-row" >
            <div className="loader-bounce gap-1 padding-10" style={{borderRadius:'5px',backgroundColor: mainBg }}>
                <div className={`dot ${dotStyle.dimensions} ${dotStyle.bgColor}`} ></div>
                <div className={`dot ${dotStyle.dimensions} ${dotStyle.bgColor}`} ></div>
                <div className={`dot ${dotStyle.dimensions} ${dotStyle.bgColor}`} ></div>
            </div>
        </div>
     );
}
 
export default LoaderDots;