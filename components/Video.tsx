"use client"

import { IKVideo, ImageKitProvider } from 'imagekitio-next'
import React from 'react'

const Video = ({videoUrl}: {videoUrl : string}) => {
  return (
    
    <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT} publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}>
        <IKVideo path={videoUrl} controls={true} className='w-full rounded-xl' />
    </ImageKitProvider>
  )
}

export default Video
