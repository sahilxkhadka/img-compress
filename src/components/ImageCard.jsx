function ImageCard() {
	return (
		<div className='w-80 h-80 my-8 mx-auto relative'>
			<img
				className='w-full object-cover h-full aspect-auto'
				src={originalImageFile && URL.createObjectURL(originalImageFile)}
				alt=''
			/>
			{compressing && <Loader />}
		</div>
	);
}

export default ImageCard;
