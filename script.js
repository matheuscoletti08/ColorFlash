
  const video = document.querySelector('video');
  const flashOverlay = document.getElementById('flashOverlay');
  const snapBtn = document.getElementById('snapBtn');
  const colorPicker = document.getElementById('colorPicker');
  const canvasContainer = document.getElementById('canvasContainer');

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', 
          width: { ideal: 2560 }, 
          height: { ideal: 1920 }
        }
      });
      video.srcObject = stream;
    } catch (err) {
      alert('Erro ao acessar a câmera: ' + err.message);
    }
  }

  function takeSnapshot() {
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const targetRatio = 3 / 4;
    let cropWidth = videoWidth;
    let cropHeight = videoHeight;
    const videoRatio = videoWidth / videoHeight;

    if (videoRatio > targetRatio) {
      cropWidth = Math.floor(videoHeight * targetRatio);
    } else if (videoRatio < targetRatio) {
      cropHeight = Math.floor(videoWidth / targetRatio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.translate(cropWidth, 0);
    ctx.scale(-1, 1);

    const sx = Math.floor((videoWidth - cropWidth) / 2);
    const sy = Math.floor((videoHeight - cropHeight) / 2);

    ctx.drawImage(video, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    ctx.restore();

    return canvas;
  }

  snapBtn.addEventListener('click', () => {
    const corFlash = colorPicker.value;

    flashOverlay.style.backgroundColor = corFlash;
    flashOverlay.style.opacity = '1';

    setTimeout(() => {
      flashOverlay.style.opacity = '0';

      const canvas = takeSnapshot();

      canvasContainer.innerHTML = '';
      canvasContainer.appendChild(canvas);

      // Cria botão download estilizado
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'selfie-flash-colorido.png';
      link.id = 'downloadBtn';  // id para estilizar
      link.textContent = 'Download da Foto';
      canvasContainer.appendChild(link);

    }, 800);
  });

  startCamera();