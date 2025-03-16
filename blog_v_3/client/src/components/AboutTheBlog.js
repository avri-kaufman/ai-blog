import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Avatar,
  Card,
  CardContent,
  Box,
} from "@mui/material";

class AboutTheBlog extends React.Component {
  render() {
    return (
      <Grid container spacing={2} style={{ padding: "16px" }}>
        <Card style={{ width: "80%", margin: "2%" }}>
          <CardContent>
            <Grid container>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  About Me
                </Typography>
                <Grid container alignItems="center">
                  <Grid item md={9}>
                    <Typography variant="body1">
                      Hi there! My name is Avi and I'm excited to tell you a little bit
                      about myself.
                    </Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Avatar
                      alt="Avi Kaufman"
                      src="https://media.licdn.com/dms/image/D4D03AQEBAQA13Zjteg/profile-displayphoto-shrink_800_800/0/1673637662090?e=1694044800&v=beta&t=wknkqyS8p0UbKxAwn8TahF04LY4Ot77qDgYCewR07sI"
                      sx={{ width: 120, height: 120 }}
                    />
                  </Grid>
                </Grid>
                <Box height={2} />
                <Typography variant="h5" gutterBottom>
                  Background
                </Typography>
                <Typography variant="body1">
                  I live in Tel-Aviv. I'm currently studying computer science and
                  thoroughly enjoying the challenges and opportunities the field
                  presents.
                </Typography>
                <Typography variant="body1">
                  Throughout my studies, I've gained valuable experience in a variety
                  of programming languages, including Java, Python, C and many more.
                </Typography>
                <Typography variant="body1">
                  Aside from my studies, I enjoy staying active and exploring all that
                  Tel Aviv has to offer. Whether it's going for a run along the beach,
                  or trying out a new restaurant.
                </Typography>
                <Box height={2} />
                <Typography variant="h5" gutterBottom>
                  Interests
                </Typography>
                <Typography variant="body1">
                  I have a variety of hobbies and interests that keep me busy when I'm
                  not studying or working. Here are a few:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Running:"
                      secondary="I love going for a morning jog to start the day. It's a great way to clear my mind and get some exercise."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Hiking:"
                      secondary="Whenever I have a free weekend, I like to explore some of the beautiful hiking trails. There are so many hidden gems to discover!"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Chess:"
                      secondary="I've been playing chess for as long as I can remember. It's a great mental challenge and helps me stay sharp."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Slackline:"
                      secondary="Recently, I've gotten into slacklining as a fun way to improve my balance and coordination. It's a great way to enjoy the outdoors, too!"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Podcasts:"
                      secondary="I'm an avid podcast listener and love learning about new topics and perspectives."
                    />
                  </ListItem>
                </List>
                <Box height={2} />
                <Typography variant="h4" gutterBottom>
                  About the Blog
                </Typography>
                <Typography variant="body1">
                  Welcome to my blog, where I combine my passion for computer science and my love for sharing knowledge. Here, I aim to make the concepts of artificial intelligence, machine learning, and new technologies accessible to anyone interested in these fields, even those who may not be familiar with the concepts. I believe that everyone should have the opportunity to understand and explore these exciting areas of study.
                </Typography>
                <Typography variant="body1">
                  Through a series of informative and easy-to-understand articles, I will unravel the complexities of AI, machine learning, and related topics. From fundamental concepts to practical applications, my goal is to provide valuable insights and empower readers to grasp the potential and implications of these cutting-edge technologies.
                </Typography>
                <Typography variant="body1">
                  So, whether you're a curious beginner or a tech enthusiast seeking to expand your knowledge, this blog is for you. Join me on this journey as we dive into the world of AI, ML, and emerging technologies, and discover how they are shaping our present and future.
                </Typography>
                <Box height={2} />
                <Typography variant="body1">
                  Stay updated with the latest articles and discussions by subscribing to my newsletter. Don't miss out on the opportunity to expand your understanding and join the exciting realm of AI and machine learning!
                </Typography>
                <Box height={2} />
                <Typography variant="body1">
                  Thank you for visiting, and I look forward to sharing this exciting learning adventure with you.
                </Typography>
                <Box height={2} />
                <Typography variant="body1">
                  Best regards,
                </Typography>
                <Typography variant="body1">
                  Avi
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default AboutTheBlog;
