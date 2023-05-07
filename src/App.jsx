import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import "./App.css";
import ImageCard from "./components/ImageCard";

function App() {
	const [originalImageFile, setOriginalImageFile] = useState("");
	const [compressedImageFile, setCompressedImageFile] = useState("");
	const [downloadLink, setDownloadLink] = useState("");
	const [compressing, setCompressing] = useState(false);
	const [error, setEroor] = useState(false);

	const fileInputRef = useRef(null);

	const handleImageInput = async (e) => {
		const image = e.target.files[0];
		setOriginalImageFile(image);
		if (typeof image === "object") setCompressing(true);
		setTimeout(async () => {
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
							8000
						)
					),
				]);
				console.log(typeof compressedFile);
				setCompressedImageFile(compressedFile);
				setDownloadLink(URL.createObjectURL(compressedFile));
				setCompressing(false);
			} catch (error) {
				setEroor(true);
				setCompressedImageFile("");
				setCompressing(false);
			}
		}, 2000);
	};

	const handleButtonClick = () => {
		setCompressedImageFile("");
		setEroor(false);
		fileInputRef.current?.click();
	};

	return (
		<>
			<h1 className='animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-[48px] font-black my-4'>
				Image Compressor
			</h1>
			<button id='file-input' className='mx-auto' onClick={handleButtonClick}>
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
			<input
				className='hidden'
				type='file'
				onInput={handleImageInput}
				accept='image/*'
				ref={fileInputRef}
			/>

			{compressedImageFile ? (
				<>
					<ImageCard imageFile={originalImageFile} compressing={compressing} />
					<a
						href={downloadLink}
						download='compressed'
						className='download-btn mx-auto'
						onClick={() => setCompressing(false)}
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
			{compressing && (
				<ImageCard imageFile={originalImageFile} compressing={compressing} />
			)}
			{error && (
				<p className='my-3 mx-auto text-base font-medium text-red-500 w-3/5 sm:w-full'>
					An erro occured! Please try again or try adding another image
				</p>
			)}
		</>
	);
}

export default App;
