import { Box, Container, Stack, Typography } from '@mui/material'

export function PageSection({ eyebrow, title, description, children, sx = {} }) {
  return (
    <Box component="section" sx={{ position: 'relative', py: { xs: 3.5, md: 5 }, ...sx }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {(eyebrow || title || description) && (
            <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
              {eyebrow ? (
                <Typography
                  variant="overline"
                  sx={{
                    color: 'primary.main',
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: 'rgba(32, 101, 209, 0.08)',
                  }}
                >
                  {eyebrow}
                </Typography>
              ) : null}
              {title ? <Typography variant="h2">{title}</Typography> : null}
              {description ? (
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
                  {description}
                </Typography>
              ) : null}
            </Stack>
          )}
          {children}
        </Stack>
      </Container>
    </Box>
  )
}
