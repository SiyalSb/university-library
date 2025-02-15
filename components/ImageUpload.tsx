"use client";

import { toast } from "@/hooks/use-toast";
import config from "@/lib/config";
import { cn } from "@/lib/utils";
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

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const ImageUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null
  });


  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: any) => {
    console.log(error);

    toast({
      title: "Failed to Upload the image",
      description: `${error}`,
      variant: "destructive",
    });
  };
  const onSuccess = (res: any) => {
    console.log("imageKit upload success response", res);
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
        useUniqueFileName={true}
        folder={folder}
        accept={accept}
        ref={ikUploadRef}
      />

      <button
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
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
        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>

        {file && (
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
        )}
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
