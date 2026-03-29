self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/kenya/app/:path*",
        "destination": "/kenya/app/:path*"
      },
      {
        "source": "/south-africa/app/:path*",
        "destination": "/south-africa/app/:path*"
      },
      {
        "source": "/nigeria/app/:path*",
        "destination": "/nigeria/app/:path*"
      },
      {
        "source": "/Beezee-App/sw.js",
        "destination": "/sw.js"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()