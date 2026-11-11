This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
## Coverage
File                                                             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s       
-----------------------------------------------------------------|---------|----------|---------|---------|-------------------------
All files                                                        |   77.21 |    65.46 |   75.28 |   77.21 |                         
 app/(auth)/sign-in/_components                                  |   90.47 |       50 |     100 |      90 |                         
  sign-in-form.tsx                                               |   89.47 |       50 |     100 |   88.88 | 39-40                   
  signin-schema.ts                                               |     100 |      100 |     100 |     100 |                         
 app/(auth)/sign-up/_components                                  |    91.3 |       50 |     100 |    90.9 |                         
  sign-up-form.tsx                                               |   90.47 |       50 |     100 |      90 | 40-41                   
  signup-schema.ts                                               |     100 |      100 |     100 |     100 |                         
 app/(main)/profile/_components                                  |     100 |     87.5 |     100 |     100 |                         
  profile-page.tsx                                               |     100 |     87.5 |     100 |     100 | 1                       
 app/(main)/profile/_components/profile-info                     |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
  logout-button.tsx                                              |     100 |      100 |     100 |     100 |                         
 app/(main)/profile/_components/profile-info/edit-profile        |   87.23 |    47.61 |   92.85 |   86.95 |                         
  edit-profile-schema.ts                                         |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |   86.04 |    47.61 |    92.3 |   85.71 | 97-98,102,124,135,142   
 app/(main)/profile/_components/profile-info/edit-profile/modals |   69.33 |    33.33 |   81.81 |   68.49 |                         
  confirm-password-modal.tsx                                     |   64.86 |       20 |   83.33 |   63.88 | 31-35,49-53,68-84,96-97 
  update-profile-image-modal.tsx                                 |   73.68 |       60 |      80 |   72.97 | 33-35,46-52,61-62,70    
 app/(main)/profile/_components/statistics                       |     100 |    72.22 |     100 |     100 |                         
  index.tsx                                                      |     100 |    64.28 |     100 |     100 | 27-53                   
  stats-card.tsx                                                 |     100 |      100 |     100 |     100 |                         
 app/(main)/profile/_components/statistics/chart-view            |   55.55 |     7.14 |   64.28 |   51.51 |                         
  index.tsx                                                      |     100 |       50 |     100 |     100 | 1                       
  options.ts                                                     |    5.88 |        0 |       0 |    5.88 | 34-117                  
 app/(main)/profile/_components/statistics/table-view            |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 app/_components/fallback                                        |    87.5 |    83.33 |   66.66 |    87.5 |                         
  index.tsx                                                      |    87.5 |    83.33 |   66.66 |    87.5 | 18                      
 app/_components/main-footer                                     |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 app/_components/main-header                                     |     100 |    93.75 |     100 |     100 |                         
  index.tsx                                                      |     100 |    93.75 |     100 |     100 | 1                       
 app/_components/main-header/auth-buttons                        |     100 |       50 |     100 |     100 |                         
  index.tsx                                                      |     100 |       50 |     100 |     100 | 1                       
 app/_components/main-header/burger-menu                         |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 app/_components/main-header/navbar                              |     100 |    83.33 |     100 |     100 |                         
  index.tsx                                                      |     100 |    83.33 |     100 |     100 | 1,33                    
 app/_components/main-header/user-nav                            |     100 |       75 |     100 |     100 |                         
  index.tsx                                                      |     100 |       75 |     100 |     100 | 1                       
 app/lib                                                         |      50 |     37.5 |       0 |      50 |                         
  config.ts                                                      |     100 |     37.5 |     100 |     100 | 3-7                     
  routes.ts                                                      |     100 |      100 |     100 |     100 |                         
  themeScript.tsx                                                |       0 |      100 |       0 |       0 | 1-27                    
 app/providers                                                   |   93.33 |       75 |   91.66 |   95.12 |                         
  index.tsx                                                      |       0 |      100 |       0 |       0 | 1-11                    
  mui-theme-provider.tsx                                         |     100 |      100 |     100 |     100 |                         
  query-provider.tsx                                             |     100 |      100 |     100 |     100 |                         
  redux-provider.tsx                                             |   95.65 |    66.66 |     100 |     100 | 18-24                   
  theme-provider.tsx                                             |     100 |      100 |     100 |     100 |                         
 app/providers/notifications-provider                            |   68.18 |        0 |   42.85 |   73.68 |                         
  context.ts                                                     |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |   78.57 |      100 |      50 |    90.9 | 16                      
  useNotifications.ts                                            |   33.33 |        0 |       0 |   33.33 | 4-8                     
 app/store                                                       |     100 |      100 |     100 |     100 |                         
  hooks.ts                                                       |     100 |      100 |     100 |     100 |                         
  theme-store.ts                                                 |     100 |      100 |     100 |     100 |                         
  user-store.ts                                                  |     100 |      100 |     100 |     100 |                         
 entities/comment                                                |    7.69 |        0 |       0 |    7.69 |                         
  index.tsx                                                      |    7.69 |        0 |       0 |    7.69 | 10-27                   
 entities/post                                                   |   93.84 |    74.13 |    87.5 |   98.24 |                         
  index.tsx                                                      |      90 |    73.17 |   81.81 |   96.96 | 88                      
  post-comments.tsx                                              |     100 |    77.77 |     100 |     100 | 1,36                    
  post.styles.tsx                                                |     100 |       75 |     100 |     100 | 1-68                    
 entities/sidebar                                                |     100 |       75 |     100 |     100 |                         
  index.tsx                                                      |     100 |       75 |     100 |     100 | 40-60                   
 entities/user/model                                             |   72.41 |      100 |      75 |   73.91 |                         
  mapUser.ts                                                     |     100 |      100 |     100 |     100 |                         
  selectors.ts                                                   |      80 |      100 |      80 |      80 | 7                       
  use-user.tsx                                                   |      40 |      100 |      50 |      50 | 8-10                    
  user-slice.ts                                                  |      75 |      100 |      75 |      75 | 27-31                   
 entities/user/ui                                                |   66.66 |      100 |       0 |   66.66 |                         
  user-card.tsx                                                  |   66.66 |      100 |       0 |   66.66 | 11                      
 features/auth                                                   |   56.84 |    69.23 |   30.76 |   58.06 |                         
  logout.ts                                                      |      25 |        0 |       0 |      25 | 2-8                     
  me.ts                                                          |   84.61 |       75 |      50 |   84.61 | 35,41                   
  refresh.ts                                                     |   91.66 |       75 |     100 |   91.66 | 32                      
  signin.ts                                                      |   88.23 |       75 |      50 |   93.75 | 60                      
  signup.ts                                                      |   88.23 |       75 |      50 |   93.75 | 59                      
  use-auth.tsx                                                   |    3.12 |      100 |       0 |    3.12 | 15-65                   
 features/create-comment                                         |   79.54 |       75 |      70 |   79.06 |                         
  create-comment-api.ts                                          |   78.57 |       50 |     100 |   78.57 | 51-55                   
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
  use-create-comment.ts                                          |       0 |      100 |       0 |       0 | 6-17                    
 features/create-post                                            |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 features/create-post/api                                        |      75 |       25 |     100 |      75 |                         
  create-post.ts                                                 |   72.72 |       25 |     100 |   72.72 | 31-35                   
  upload-image.ts                                                |   76.92 |       25 |     100 |   76.92 | 28-32                   
 features/create-post/create-post-modal                          |    91.3 |       75 |   88.88 |    90.9 |                         
  create-post-modal.tsx                                          |   90.69 |       75 |    87.5 |   90.24 | 59-61,95                
  create-post-schema.ts                                          |     100 |      100 |     100 |     100 |                         
 features/create-post/hooks                                      |       0 |        0 |       0 |       0 |                         
  use-create-post.ts                                             |       0 |        0 |       0 |       0 | 11-20                   
 features/delete-comment                                         |   84.21 |       25 |     100 |   84.21 |                         
  delete-comment-api.ts                                          |    62.5 |       25 |     100 |    62.5 | 12-16                   
  use-delete-comment.ts                                          |     100 |      100 |     100 |     100 |                         
 features/delete-post                                            |   83.33 |       25 |     100 |   83.33 |                         
  delete-post-api.ts                                             |    62.5 |       25 |     100 |    62.5 | 10-14                   
  use-delete-post.ts                                             |     100 |      100 |     100 |     100 |                         
 features/delete-post/ui                                         |   93.75 |      100 |      80 |   93.33 |                         
  delete-post-button.tsx                                         |      90 |      100 |   66.66 |   88.88 | 20                      
  delete-post-modal.tsx                                          |     100 |      100 |     100 |     100 |                         
 features/edit-profile                                           |   79.24 |     37.5 |     100 |   79.24 |                         
  update-account.ts                                              |   66.66 |       25 |     100 |   66.66 | 31-35                   
  update-profile-api.ts                                          |   72.72 |       25 |     100 |   72.72 | 27-31                   
  upload-avatar.ts                                               |     100 |      100 |     100 |     100 |                         
  use-update-account.ts                                          |      80 |       50 |     100 |      80 | 17-18                   
  use-update-avatar.ts                                           |      90 |       50 |     100 |      90 | 21                      
  use-update-profile.ts                                          |      75 |       50 |     100 |      75 | 6,17                    
 features/get-comments                                           |      25 |        0 |   18.18 |    25.8 |                         
  get-comments.ts                                                |   33.33 |        0 |   33.33 |   33.33 | 21-40,48                
  use-comment-authors.ts                                         |   14.28 |      100 |    12.5 |   15.38 | 8-27                    
 features/get-statistics                                         |   23.07 |      100 |   16.66 |   23.07 |                         
  stats.ts                                                       |   23.07 |      100 |   16.66 |   23.07 | 9,13-38                 
 features/language-switcher                                      |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 features/like-post                                              |   46.87 |    14.28 |   33.33 |   46.87 |                         
  like-post-api.ts                                               |      60 |    16.66 |     100 |      60 | 23-31,47-55             
  use-like-post.ts                                               |       0 |        0 |       0 |       0 | 12-21                   
 features/post-feed                                              |   73.72 |    65.51 |   55.55 |   75.67 |                         
  posts-list.tsx                                                 |   94.44 |    94.11 |     100 |   94.11 | 47                      
  posts-query.ts                                                 |   91.17 |    86.95 |      80 |   91.17 | 144,204-213             
  update-posts-cache.ts                                          |   23.33 |    11.11 |   18.18 |   20.83 | 13-17,27-50,67-72       
  usePosts.ts                                                    |      50 |      100 |       0 |      50 | 5                       
 features/theme-switcher                                         |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 shared/api                                                      |   20.83 |        0 |   11.11 |   20.83 |                         
  api-client.ts                                                  |   17.07 |        0 |       0 |   17.07 | 17-23,29-41,45-53,59-81 
  graphql-client.ts                                              |      20 |        0 |       0 |      20 | 8-17                    
  queryClient.ts                                                 |     100 |      100 |     100 |     100 |                         
 shared/lib                                                      |       0 |      100 |       0 |       0 |                         
  update-token.ts                                                |       0 |      100 |       0 |       0 | 2                       
 shared/lib/hooks                                                |   89.39 |    80.76 |   86.66 |   89.83 |                         
  use-block-scroll.ts                                            |     100 |      100 |     100 |     100 |                         
  use-focus-trap.ts                                              |     100 |       80 |     100 |     100 | 49-54                   
  use-intersection-observer.ts                                   |   71.42 |       75 |      75 |   66.66 | 10-13,17                
  use-modal.ts                                                   |   66.66 |      100 |   66.66 |   66.66 | 3-4                     
 shared/lib/localization                                         |   86.66 |       80 |     100 |   86.66 |                         
  format-number.ts                                               |     100 |      100 |     100 |     100 |                         
  format-relative-time.ts                                        |   84.61 |       80 |     100 |   84.61 | 17-19                   
 shared/lib/stats                                                |   88.09 |    95.65 |     100 |    87.5 |                         
  count-by-day.ts                                                |    90.9 |       90 |     100 |      90 | 23-24                   
  date-stats.ts                                                  |      85 |      100 |     100 |      85 | 19-22                   
 shared/ui/avatar                                                |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 shared/ui/button                                                |     100 |    66.66 |     100 |     100 |                         
  index.tsx                                                      |     100 |    66.66 |     100 |     100 | 1                       
 shared/ui/cover-button                                          |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 shared/ui/fallback                                              |       0 |        0 |       0 |       0 |                         
  index.tsx                                                      |       0 |        0 |       0 |       0 | 1-25                    
 shared/ui/file-input                                            |     100 |    86.95 |     100 |     100 |                         
  index.tsx                                                      |     100 |    86.95 |     100 |     100 | 1,45-55                 
 shared/ui/input                                                 |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 shared/ui/loader                                                |      40 |        0 |       0 |      40 |                         
  index.tsx                                                      |      40 |        0 |       0 |      40 | 9-17                    
 shared/ui/modal                                                 |     100 |    92.85 |     100 |     100 |                         
  index.tsx                                                      |     100 |    92.85 |     100 |     100 | 1                       
 shared/ui/notification                                          |    91.3 |      100 |      75 |   95.23 |                         
  index.tsx                                                      |    91.3 |      100 |      75 |   95.23 | 36                      
 shared/ui/password-input                                        |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 shared/ui/select                                                |   95.45 |    83.33 |     100 |   94.73 |                         
  index.tsx                                                      |   95.45 |    83.33 |     100 |   94.73 | 31                      
 shared/ui/show-input-info                                       |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 shared/ui/tabs                                                  |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 shared/ui/text-area                                             |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         
 shared/ui/toggle                                                |     100 |      100 |     100 |     100 |                         
  index.tsx                                                      |     100 |      100 |     100 |     100 |                         

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
