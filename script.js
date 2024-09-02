// Carrega a imagem de perfil selecionada pelo usuário e faz o corte para quadrado na pré-visualização
function loadImage(event) {
    const profilePicture = document.getElementById('profilePicture');

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function() {
            // Corta a imagem carregada para ser quadrada
            const croppedCanvas = cropImageToSquare(img);

            // Exibe a imagem cortada na pré-visualização
            profilePicture.src = croppedCanvas.toDataURL('image/png');
        };
    };

    reader.readAsDataURL(file);
}

// Função para fazer o corte da imagem centralizada
function cropImageToSquare(image) {
    const minSize = Math.min(image.width, image.height);
    const startX = (image.width - minSize) / 2;
    const startY = (image.height - minSize) / 2;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = minSize;
    canvas.height = minSize;

    // Desenha a imagem cortada no canvas
    ctx.drawImage(image, startX, startY, minSize, minSize, 0, 0, minSize, minSize);

    return canvas;
}

// Seleciona o twibbon desejado
function selectTwibbon(twibbonSrc) {
    const twibbonOverlay = document.getElementById('twibbonOverlay');
    twibbonOverlay.src = twibbonSrc;
}

// Baixa a imagem final com o twibbon
function downloadImage() {
    const profilePicture = document.getElementById('profilePicture');
    const twibbonOverlay = document.getElementById('twibbonOverlay');

    if (profilePicture.src && !profilePicture.src.includes('default-avatar.png') && twibbonOverlay.src) {
        const profileImage = new Image();
        profileImage.src = profilePicture.src;

        const twibbonImage = new Image();
        twibbonImage.src = twibbonOverlay.src;

        // Espera até que as duas imagens estejam carregadas
        Promise.all([
            new Promise(resolve => { profileImage.onload = resolve }),
            new Promise(resolve => { twibbonImage.onload = resolve })
        ]).then(() => {
            // Define o canvas para ser quadrado com base na imagem já cortada
            const finalCanvas = document.createElement('canvas');
            const finalCtx = finalCanvas.getContext('2d');

            finalCanvas.width = profileImage.width;
            finalCanvas.height = profileImage.height;

            // Desenha a imagem de perfil quadrada no canvas
            finalCtx.drawImage(profileImage, 0, 0, finalCanvas.width, finalCanvas.height);

            // Desenha o twibbon sobre a imagem cortada
            finalCtx.drawImage(twibbonImage, 0, 0, finalCanvas.width, finalCanvas.height);

            // Faz o download da imagem final
            const link = document.createElement('a');
            link.download = 'foto_perfil_atualizada.png';
            link.href = finalCanvas.toDataURL('image/png');
            link.click();
        }).catch((error) => {
            console.error("Erro ao carregar as imagens: ", error);
        });
    } else {
        alert('Por favor, carregue uma imagem de perfil e escolha um design antes de baixar.');
    }
}
