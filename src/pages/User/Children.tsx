import React, { useState, useEffect } from 'react'
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Collapse,
  Fade,
} from '@material-ui/core'
import { ComponentWithUserParams } from './index'
import { makeStyles } from '@material-ui/core/styles'
import UserAvatar from 'src/components/blocks/UserAvatar'
import { UserExtended } from 'src/interfaces/User'
import { Link } from 'react-router-dom'
import { useSelector } from 'src/hooks'
import ProfileChildrenSkeleton from 'src/components/skeletons/ProfileChildren'
import { useDispatch } from 'react-redux'
import { getUserChildren } from 'src/store/actions/user'

const useStyles = makeStyles((theme) => ({
  blockTitle: {
    fontSize: 24,
    fontWeight: 500,
    fontFamily: 'Google Sans',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.primary.dark,
    },
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  errorText: {
    color: theme.palette.error.main,
    fontWeight: 500,
    fontFamily: 'Google Sans',
    marginTop: theme.spacing(2),
  },
  collapse: {
    position: 'relative',
  },
  collapseShadow: {
    position: 'absolute',
    background:
      'linear-gradient(0deg,' +
      theme.palette.background.default +
      ',transparent)',
    bottom: 0,
    pointerEvents: 'none',
    height: 40,
    width: '100%',
  },
}))

const Children = ({ classes: additionalClasses }: ComponentWithUserParams) => {
  const [showAll, setShowAll] = useState<boolean>(false)
  const classes = useStyles()
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.user.profile.user.data)
  const childrenData = useSelector((store) => store.user.profile.children.data)
  const isFetched = useSelector((store) => store.user.profile.children.fetched)
  const isFetching = useSelector(
    (store) => store.user.profile.children.fetching
  )
  const fetchError = useSelector((store) => store.user.profile.children.error)
  const sorted = (childrenData?.users || []).sort(
    (a, b) => Date.parse(a.time_registered) - Date.parse(b.time_registered)
  )

  useEffect(() => {
    setShowAll(false)
    dispatch(getUserChildren(user.login))
  }, [user.login, dispatch])

  const Item = ({ data }: { data: UserExtended }) => (
    <ListItem
      style={{ paddingLeft: 0, paddingRight: 0 }}
      component={Link}
      to={'/user/' + data.login}
    >
      <ListItemAvatar>
        <UserAvatar
          className={classes.avatar}
          src={data.avatar}
          login={data.login}
        />
      </ListItemAvatar>
      <ListItemText
        style={{ margin: 0 }}
        primaryTypographyProps={{ className: classes.link }}
        primary={'@' + data.login}
        secondary={data.specializm}
      />
    </ListItem>
  )

  if (fetchError)
    return (
      <Typography className={classes.errorText}>
        Не удалось загрузить список приглашённых пользователей
      </Typography>
    )
  if (isFetching) return <ProfileChildrenSkeleton />

  return isFetched && sorted.length !== 0 ? (
    <div className={additionalClasses}>
      <Typography className={classes.blockTitle}>Пригласил на сайт</Typography>
      <Collapse className={classes.collapse} in={showAll} collapsedHeight={280}>
        <List>
          {sorted.map((e) => (
            <Item data={e} key={e.id} />
          ))}
        </List>
        <Fade appear={false} in={!showAll}>
          <div className={classes.collapseShadow} />
        </Fade>
      </Collapse>

      {sorted.length > 5 && (
        <Button
          size="small"
          style={{ marginTop: 8 }}
          onClick={() => setShowAll((prev) => !prev)}
          variant="outlined"
        >
          {showAll ? 'Скрыть' : 'Показать всех'}
        </Button>
      )}
    </div>
  ) : null
}

export default Children