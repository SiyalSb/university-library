"use client";

import { toast } from "@/hooks/use-toast";
import config from "@/lib/config";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import Image from "next/image";
import { useRef, useState } from "react";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
    apiEndpoint,
  },
} = config;

const authenticator = async () => {
  try {
    const respose = await fetch(`${apiEndpoint}/api/auth/imagekit`);

    if (!respose.ok) {
      const errorText = await respose.text();
      throw new Error(
        `Request failed with status ${respose.status}: ${errorText} `
      );
    }

    const data = await respose.json();
    const { signature, token, expire } = data;
    return { signature, token, expire };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (error: any) => {
    console.log(error);

    toast({
      title: "Failed to Upload the image",
      description: `Image cant't be uploaded. Please try again`,
      variant: "destructive",
    });
  };
  const onSuccess = (res: any) => {
    console.log("imageKit upload success response", res)
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: "Image Uploaded Successfully",
      description: `${res.filePath} has been uploaded successfully`,
    });
  };

  return (
    <ImageKitProvider
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        onSuccess={onSuccess}
        onError={onError}
        fileName="test-upload.png"
        ref={ikUploadRef}
      />

      <button
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();

          
            
            ikUploadRef.current?.click();
          
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>

      {file && (
        <IKImage
        alt={file.filePath}
        path={file.filePath}
        width={500}
        height={300}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
