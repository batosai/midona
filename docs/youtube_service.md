# Service YouTube

Ce service permet de récupérer et télécharger des vidéos YouTube à partir d'une URL.

## Installation

Avant d'utiliser le service, vous devez installer les dépendances nécessaires :

```bash
npm install ytdl-core @types/ytdl-core
```

## Utilisation

### Import du service

```typescript
import { YouTubeService } from '#services/youtube_service'
```

### Exemple basique

```typescript
const youtubeService = new YouTubeService()

// Télécharger une vidéo
const filePath = await youtubeService.downloadVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
console.log('Vidéo téléchargée:', filePath)
```

### Obtenir les informations d'une vidéo

```typescript
const videoInfo = await youtubeService.getVideoInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
console.log('Titre:', videoInfo.title)
console.log('Durée:', videoInfo.duration)
console.log('Thumbnail:', videoInfo.thumbnail)
```

### Télécharger avec options

```typescript
const filePath = await youtubeService.downloadVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
  quality: 'highest', // 'highest' | 'lowest' | 'audio' | 'video'
  format: 'mp4', // 'mp4' | 'webm' | 'mp3'
  outputPath: '/custom/path',
  filename: 'ma_video.mp4',
  onProgress: (progress) => {
    console.log(`Progression: ${progress.percentage.toFixed(2)}%`)
  }
})
```

### Télécharger uniquement l'audio

```typescript
const audioPath = await youtubeService.downloadAudio('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
  filename: 'mon_audio.mp3'
})
```

### Vérifier la disponibilité

```typescript
const isAvailable = await youtubeService.isVideoAvailable('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
console.log('Vidéo disponible:', isAvailable)
```

### Obtenir les formats disponibles

```typescript
const formats = await youtubeService.getAvailableFormats('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
console.log('Formats disponibles:', formats.length)
```

## API REST

Le service expose également une API REST via le contrôleur `YouTubeController`.

### Endpoints disponibles

- `GET /api/youtube/info` - Obtenir les informations d'une vidéo
- `POST /api/youtube/download` - Télécharger une vidéo
- `POST /api/youtube/download/audio` - Télécharger uniquement l'audio
- `GET /api/youtube/formats` - Obtenir les formats disponibles
- `GET /api/youtube/check` - Vérifier la disponibilité

### Exemple d'utilisation de l'API

```bash
# Obtenir les informations d'une vidéo
curl -X GET "http://localhost:3333/api/youtube/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Télécharger une vidéo
curl -X POST "http://localhost:3333/api/youtube/download" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "quality": "highest",
    "format": "mp4"
  }'

# Télécharger uniquement l'audio
curl -X POST "http://localhost:3333/api/youtube/download/audio" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "filename": "mon_audio.mp3"
  }'
```

## Options de téléchargement

### YouTubeDownloadOptions

```typescript
interface YouTubeDownloadOptions {
  quality?: 'highest' | 'lowest' | 'audio' | 'video'
  format?: 'mp4' | 'webm' | 'mp3'
  outputPath?: string
  filename?: string
  onProgress?: (progress: DownloadProgress) => void
}
```

### DownloadProgress

```typescript
interface DownloadProgress {
  downloadedBytes: number
  totalBytes: number
  percentage: number
  speed: string
  eta: string
}
```

## Gestion des erreurs

Le service gère automatiquement les erreurs courantes :

- URLs YouTube invalides
- Vidéos non disponibles
- Erreurs de réseau
- Fichiers déjà existants
- Erreurs de permissions

```typescript
try {
  const filePath = await youtubeService.downloadVideo(url)
  console.log('Succès:', filePath)
} catch (error) {
  console.error('Erreur:', error instanceof Error ? error.message : 'Erreur inconnue')
}
```

## Configuration

### Chemin de sortie par défaut

Les fichiers sont téléchargés par défaut dans :
```
storage/downloads/youtube/
```

### Génération automatique des noms de fichiers

Si aucun nom de fichier n'est spécifié, le service génère automatiquement un nom basé sur :
- Le titre de la vidéo (nettoyé)
- La date du téléchargement
- Le format choisi

Exemple : `Ma_Video_2024-01-15.mp4`

## Limitations

- Le service utilise `ytdl-core` qui peut nécessiter des mises à jour régulières pour rester compatible avec YouTube
- Certaines vidéos peuvent être protégées et non téléchargeables
- La qualité et les formats disponibles dépendent de la vidéo source

## Dépannage

### Erreur "Invalid YouTube URL"
- Vérifiez que l'URL est une URL YouTube valide
- Assurez-vous que la vidéo est publique

### Erreur "Video not available"
- La vidéo peut être privée ou supprimée
- Vérifiez que la vidéo est accessible depuis votre région

### Erreur de permissions
- Vérifiez les permissions du dossier de sortie
- Assurez-vous d'avoir les droits d'écriture

## Exemples complets

Voir le fichier `examples/youtube_service_example.ts` pour des exemples d'utilisation complets.
