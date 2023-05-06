import React from "react";
import Loader from "./Loader";
type ImageCardProps = {
	imageFile: File;
	compressing: boolean;
};

function ImageCard(props: ImageCardProps) {
	return (
		<div className='container'>
			<div className='w-80 h-80 my-8 mx-auto relative card_box'>
				<img
					className='w-full object-cover h-full aspect-auto'
					src={props.imageFile && URL.createObjectURL(props.imageFile)}
					alt=''
				/>
				{props.compressing ? <Loader /> : <span></span>}
			</div>
		</div>
	);
}

export default ImageCard;
