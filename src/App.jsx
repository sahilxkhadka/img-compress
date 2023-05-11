import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import "./App.css";
import ImageCard from "./components/ImageCard";

function App() {
	const [dragActive, setDragActive] = useState(false);
	const [imageData, setImageData] = useState({
		originalImageFile: "",
		compressedImageFile: "",
		downloadLink: "",
		compressing: false,
		error: false,
	});

	const fileInputRef = useRef(null);

	const compressImageInput = async (image) => {
		setImageData({
			...imageData,
			originalImageFile: image,
			compressing: typeof image === "object",
			error: false,
		});
		const options = {
			maxSizeMB: 0.5,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
		};
		try {
			const compressedFile = await Promise.race([
				imageCompression(image, options),
				new Promise((_, reject) =>
					setTimeout(
						() => reject(new Error("Image compression timed out")),
						7000
					)
				),
			]);
			setTimeout(() => {
				setImageData({
					...imageData,
					compressedImageFile: compressedFile,
					downloadLink: URL.createObjectURL(compressedFile),
					compressing: false,
				});
			}, 2700);
		} catch (error) {
			setImageData({
				...imageData,
				error: true,
				compressedImageFile: "",
				compressing: false,
			});
		}
	};

	const handleImageInput = (e) => {
		const image = e.target.files[0];
		compressImageInput(image);
	};

	const handleButtonClick = () => {
		setImageData({
			...imageData,
			compressedImageFile: "",
			error: false,
		});
		fileInputRef.current?.click();
	};

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(true);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			compressImageInput(e.dataTransfer.files[0]);
		}
	};

	return (
		<>
			<h1 className='animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-[48px] font-black my-4'>
				Image Compressor
			</h1>
			<div className='flex'></div>
			<form
				className={`sm:w-96 sm:h-32 bg-gray-400 mx-auto my-4 rounded-lg relative flex flex-col justify-center items-center gap-2 ${
					dragActive ? "bg-white" : "bg-gray-300"
				} `}
				onDragEnter={handleDrag}
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<button id='file-input' onClick={handleButtonClick}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						width='24'
						height='24'
					>
						<path fill='none' d='M0 0h24v24H0z'></path>
						<path
							fill='currentColor'
							d='M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z'
						></path>
					</svg>
					<span>Add</span>
				</button>
				<p className='text-sm'>Drag and Drop File here to upload.</p>
				<input
					className='hidden'
					type='file'
					onInput={handleImageInput}
					accept='image/*'
					ref={fileInputRef}
				/>
				{dragActive && (
					<div
						className='absolute inset-0 h-full w-full'
						onDragEnd={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
					></div>
				)}
			</form>
			{imageData.compressedImageFile ? (
				<>
					<ImageCard
						imageFile={imageData.compressedImageFile}
						compressing={imageData.compressing}
					/>
					<a
						href={imageData.downloadLink}
						download='compressed'
						className='download-btn mx-auto'
						onClick={() =>
							setImageData({
								...imageData,
								compressing: false,
							})
						}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							width='24'
							height='24'
						>
							<path fill='none' d='M0 0h24v24H0z'></path>
							<path
								fill='currentColor'
								d='M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 12h3l-4 5-4-5h3V8h2v4z'
							></path>
						</svg>
						<span>Download</span>
					</a>
				</>
			) : (
				<p className='my-3 text-sm'>SVG, PNG, JPG or GIF.</p>
			)}
			{imageData.compressing && (
				<ImageCard
					imageFile={imageData.originalImageFile}
					compressing={imageData.compressing}
				/>
			)}
			{imageData.error && (
				<p className='my-3 mx-auto text-base font-medium text-red-500 w-3/5 sm:w-full'>
					An error occured! Please try again or try adding another image
				</p>
			)}
		</>
	);
}

export default App;
