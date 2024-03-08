import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { MIN_WIDTH,
		MAIN_BLOCK_MARGIN_LEFT,
		MAIN_BLOCK_MARGIN_RIGHT,
} from 'src/config/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
	marginLeft: MAIN_BLOCK_MARGIN_LEFT,
    marginRight: theme.spacing(MAIN_BLOCK_MARGIN_RIGHT),
    maxWidth: `calc(100% - 300px - ${theme.spacing(2)}px)`,
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.down(MIN_WIDTH)]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },
}))

const MainBlock: React.FC<React.PropsWithChildren> = ({ children }) => {
  const classes = useStyles()

  return <div className={classes.root}>{children}</div>
}

export default MainBlock
