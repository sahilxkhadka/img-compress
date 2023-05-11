import React from "react";
import Loader from "./Loader";
type ImageCardProps = {
	imageFile: File;
	compressing?: boolean;
};

function ImageCard(props: ImageCardProps) {
	return (
		<div className='container'>
			<div className='w-80 sm:h-60 my-8 mx-auto relative card_box'>
				<img
					className='w-full sm:h-full object-contain aspect-auto sm:object-cover'
					src={props.imageFile && URL.createObjectURL(props.imageFile)}
					alt=''
				/>
				{props.compressing ? <Loader /> : <span></span>}
			</div>
		</div>
	);
}

export default ImageCard;
