# Media URL Validation Error Examples

## Invalid Image Extension
```json
{
  "imageUrl": "https://example.com/image.txt"
}
```
**Error:** `imageUrl must be a valid image URL with extensions: jpg, jpeg, png, gif, webp, svg`

## Invalid Video Extension
```json
{
  "videoUrl": "https://example.com/video.txt"
}
```
**Error:** `videoUrl must be a valid video URL with extensions: mp4, avi, mov, wmv, flv, webm`

## Non-HTTP/HTTPS Protocol
```json
{
  "imageUrl": "ftp://example.com/image.jpg"
}
```
**Error:** `imageUrl must be a valid image URL with extensions: jpg, jpeg, png, gif, webp, svg`

## URL Too Long
```json
{
  "imageUrl": "https://example.com/very-long-path-that-exceeds-2048-characters..."
}
```
**Error:** `imageUrl URL is too long. Maximum length is 2048 characters.`

## Invalid Array Element
```json
{
  "screenshots": [
    "https://example.com/screenshot1.jpg",
    "https://example.com/screenshot2.txt"  // Invalid extension
  ]
}
```
**Error:** `screenshots must be an array of valid image URLs with extensions: jpg, jpeg, png, gif, webp, svg`
