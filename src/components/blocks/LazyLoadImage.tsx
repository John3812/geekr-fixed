import React, { useState, useRef } from 'react'
import {
  CircularProgress,
  Fade,
  makeStyles,
  Portal,
  Typography,
} from '@material-ui/core'
//import { POST_ITEM_VISIBILITY_THRESHOLD } from 'src/config/constants'
import { useSelector } from 'src/hooks'
import { ImageSlider } from './ImageSlider'

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    overflow: 'hidden',
    display: 'inline-flex',
    flexDirection: 'column',
  },
  image: {
    height: 'auto',
    maxWidth: '100%',
    verticalAlign: 'middle',
    '-webkit-tap-highlight-color': 'transparent',
    cursor: 'pointer',
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    fontSize: 12,
  },
  imagePlaceholder: {
    height: 'auto',
    maxWidth: '100%',
    verticalAlign: 'middle',
    display: 'block',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'imgAlign-left': {
    float: 'left',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    maxWidth: '40% !important',
  },
  'imgAlign-right': {
    float: 'right',
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
    maxWidth: '40% !important',
  },
}))

const useImagePlaceholderStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    background: theme.palette.action.hover,
    borderRadius: 4,
    maxWidth: '100%',
    width: '100%',
  },
  title: {
    fontFamily: 'Google Sans',
    fontSize: 16,
    fontWeight: 500,
    color: theme.palette.text.primary + ' !important',
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: '14px !important',
    fontWeight: 'normal',
    color: theme.palette.text.secondary,
    textDecoration: 'underline',
    marginTop: theme.spacing(1) + 'px !important',
  },
  button: {
    padding: theme.spacing(1.5, 2),
    width: '100%',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover > p': {
      color: theme.palette.primary.main,
    },
  },
}))

const ImagePlaceholderUnmemoized: React.FC<{
  style?: Record<string, string | number>
  showMediaElementText?: boolean
  setShouldShowImage: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ style, showMediaElementText, setShouldShowImage }) => {
  const classes = useImagePlaceholderStyles()
  const handleClick = () => setShouldShowImage(true)

  return (
    <div
      className={classes.root}
      style={{ aspectRatio: `auto ${style?.width} / ${style?.height}` }}
    >
      <button onClick={handleClick} className={classes.button}>
        <Typography className={classes.title}>
          {showMediaElementText
            ? 'Здесь был медиаэлемент'
            : 'Здесь была картинка'}
        </Typography>
        <Typography className={classes.text}>
          Нажмите здесь, чтобы показать элемент
        </Typography>
      </button>
    </div>
  )
}
const ImagePlaceholder = React.memo(ImagePlaceholderUnmemoized)

interface LazyLoadImageProps {
  src: string
  placeholderSrc?: string
  style: Record<string, string | number>
  alt: string
  className: string
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  disableZoom?: boolean
  align?: 'left' | 'right' | null
}

interface ImageProps {
  src: string
  loading: boolean
  isVisible: boolean
  style: Record<string, string | number>
  alt: string
  className: string
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  disableZoom?: boolean
  align?: 'left' | 'right' | null
  onClick: () => void
}

const ImageUnmemoized = React.forwardRef<HTMLImageElement, ImageProps>(
  function ImageComponent(
    { src, loading, style, alt, className, align, onClick },
    ref
  ) {
    const [hasError, setHasError] = React.useState(false)
    // If image loaded with error, the useStyles `isLoading` prop should be false,
    // so the image won't be blurred
    const classes = useStyles()
    const imgClasses = [classes.image, className]
    const loadingStyle = hasError || !loading ? {} : { filter: 'blur(16px)' }
    const imageContainerClasses = [classes.imageContainer]

    if (loading && (!src || src === '/img/image-loader.svg'))
      return (
        <span
          className={classes.imagePlaceholder + ' ' + className}
          style={{
            ...style,
            aspectRatio: `auto ${style.width} / ${style.height}`,
          }}
        >
          <CircularProgress size="1.25rem" thickness={5} />
        </span>
      )

    if (align) {
      imageContainerClasses.push(
        // TODO: fix types
        //@ts-expect-error
        classes['imgAlign-' + align]
      )
    }

    return (
      <div
        className={imageContainerClasses.join(' ')}
        style={{
          aspectRatio: `auto ${style.width} / ${style.height}`,
        }}
      >
        <Fade in timeout={250} mountOnEnter>
          <img
            ref={ref}
            onClick={() => !loading && !hasError && onClick()}
            className={imgClasses.join(' ')}
            width={style?.width}
            height={style?.height}
            style={loadingStyle}
            src={src}
            alt={alt || 'Изображение не загружено'}
            onError={() => setHasError(true)}
          />
        </Fade>
      </div>
    )
  }
)
const Image = React.memo(ImageUnmemoized)
/* [FIXME] */
const LazyLoadImage: React.FC<LazyLoadImageProps> = (props) => {
  const shouldReplaceImagesWithPlaceholder = useSelector(
    (store) => store.settings.readerSettings.replaceImagesWithPlaceholder
  )
  const [shouldShowImage, setShouldShowImage] = useState(
    !shouldReplaceImagesWithPlaceholder
  )
  const { style, alt, className, disableZoom, align, placeholderSrc } = props

  return shouldShowImage ? (
	<ImageSlider src={ props.src } expandable />
  ) : (
    <ImagePlaceholder setShouldShowImage={setShouldShowImage} style={style} />
  )
}

export default React.memo(LazyLoadImage)
