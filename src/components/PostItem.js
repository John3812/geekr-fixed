import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown'
import VisibilityIcon from '@material-ui/icons/Visibility'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import { makeStyles, darken, lighten } from '@material-ui/core/styles'
import formatNumber from '../utils/formatNumber'
import GreenRedNumber from './GreenRedNumber'
import moment from 'moment'
import parse from 'html-react-parser'

const ld = { lighten, darken}
const useStyles = makeStyles(theme => ({
  noDeco: {
    textDecoration: 'none !important',
  },
  postLink: {
    color: theme.palette.text.primary,
    '&:visited > p': {
      color: ld[theme.palette.type + 'en'](theme.palette.text.primary, 0.4)
    },
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    background: theme.palette.background.paper,
  },
  postTitle: {
    fontWeight: 800,
    fontFamily: 'Google Sans',
    fontSize: 20,
    marginTop: theme.spacing(1),
    // Highlight the search query in post's title
    '& .searched-item': {
      color: theme.palette.primary.light,
    },
  },
  previewHTML: {
    marginTop: theme.spacing(1),
    '& .searched-item': {
      color: theme.palette.primary.light,
    },
  },
  postAuthor: {
    color: theme.palette.primary.light,
    marginRight: theme.spacing(1),
    fontWeight: 800,
  },
  postTs: {
    color: theme.palette.text.hint,
  },
  postAvatar: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
  },
  postBottomRow: {
    marginTop: theme.spacing(2),
  },
  postBottomRowItem: {
    color: theme.palette.text.hint,
    fontSize: 8,
  },
  postBottomRowItemIcon: {
    fontSize: 16,
    marginRight: theme.spacing(1),
  },
}))

export const PostItem = ({ post, showPreview }) => {
  const classes = useStyles()
  const ts = moment(post.time_published)
    .calendar()
    .toLowerCase()
  const { login, avatar } = post.author
  const {
    title: unparsedTitle,
    id,
    score: sc,
    reading_count,
    favorites_count,
    comments_count,
    preview_html: previewHTML,
  } = post
  const title = parse(unparsedTitle)
  const reads = formatNumber(reading_count)
  const score = formatNumber(sc)
  const favorites = formatNumber(favorites_count)
  const comments = formatNumber(comments_count)
  const bottomRow = [
    {
      icon: <ThumbsUpDownIcon className={classes.postBottomRowItemIcon} />,
      count: score,
      coloredText: true,
    },
    {
      icon: <VisibilityIcon className={classes.postBottomRowItemIcon} />,
      count: reads,
    },
    {
      icon: <BookmarkIcon className={classes.postBottomRowItemIcon} />,
      count: favorites,
    },
    {
      icon: <ChatBubbleIcon className={classes.postBottomRowItemIcon} />,
      count: comments,
    },
  ]

  return (
    <ListItem className={classes.paper}>
      <Grid container>
        <Grid alignItems="center" container direction="row">
          <Avatar src={avatar} className={classes.postAvatar} />
          <Typography variant="caption">
            <Link
              className={classes.noDeco + ' ' + classes.postAuthor}
              to={'/user/' + login}
            >
              {login}
            </Link>
          </Typography>
          <Typography className={classes.postTs} variant="caption">
            {ts}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Link
            className={classes.postLink + ' ' + classes.noDeco}
            to={'/article/' + id}
          >
            <Typography className={classes.postTitle}>{title}</Typography>
          </Link>
        </Grid>
        {showPreview && (
          <Grid className={classes.previewHTML} item>
            <Typography>{parse(previewHTML)}</Typography>
          </Grid>
        )}
        <Grid className={classes.postBottomRow} container xs={12}>
          {bottomRow.map(({ icon, count, coloredText }, i) => (
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
              xs={3}
              key={i}
              className={classes.postBottomRowItem}
            >
              {icon}
              <div style={{ fontSize: 12, fontWeight: 600 }}>
                {coloredText ? (
                  <GreenRedNumber
                    number={count}
                    defaultClass={classes.postBottomRowItem}
                    style={{ fontSize: 12, fontWeight: 600 }}
                  />
                ) : (
                  count
                )}
              </div>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </ListItem>
  )
}

export default PostItem
