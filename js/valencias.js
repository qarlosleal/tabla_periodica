<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Aprender valencias</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="css/styles.css">
</head>

<body>

<div class="title-row">
  <h1>Aprender valencias</h1>
  <button class="icon-btn" onclick="location.href='index.html'" title="Menú">🏠</button>
</div>

<div class="contenedor-tabla">
  <!-- Misma idea de rejilla: 9 columnas como tu tabla principal -->
  <div class="titulos">
    <div class="titulo">Ia</div>
    <div class="titulo">IIa</div>
    <div></div>
    <div class="titulo">IIIa</div>
    <div class="titulo">IVa</div>
    <div class="titulo">Va</div>
    <div class="titulo">VIa</div>
    <div class="titulo">VIIa</div>
    <div class="titulo">VIIIa</div>
  </div>

  <div class="cuerpo">
    <!-- fila única con botones por grupo -->
    <button class="celda val-btn" style="grid-column:1; grid-row:1"
            onclick="speak('Grupo Ia. Valencia 1')">
      Ia
    </button>

    <button class="celda val-btn" style="grid-column:2; grid-row:1"
            onclick="speak('Grupo IIa. Valencia 2')">
      IIa
    </button>

    <button class="celda val-btn" style="grid-column:4; grid-row:1"
            onclick="speak('Grupo IIIa. Valencias 1 y 3')">
      IIIa
    </button>

    <button class="celda val-btn" style="grid-column:5; grid-row:1"
            onclick="speak('Grupo IVa. Valencias 2 y 4')">
      IVa
    </button>

    <button class="celda val-btn" style="grid-column:6; grid-row:1"
            onclick="speak('Grupo Va. Valencias 1, 3 y 5')">
      Va
    </button>

    <button class="celda val-btn" style="grid-column:7; grid-row:1"
            onclick="speak('Grupo VIa. Valencias 2, 4 y 6')">
      VIa
    </button>

    <button class="celda val-btn" style="grid-column:8; grid-row:1"
            onclick="speak('Grupo VIIa. Valencias 1, 3, 5 y 7')">
      VIIa
    </button>

    <div class="bloque" style="grid-column:9; grid-row:1;">
      VIIIa
    </div>
  </div>

  <p style="text-align:center; margin-top:14px; max-width:720px;">
    Pulsa un grupo para escuchar sus valencias.
  </p>
</div>

<script src="js/valencias.js" defer></script>
</body>
</html>

