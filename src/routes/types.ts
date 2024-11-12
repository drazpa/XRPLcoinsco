export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  title: string;
  icon?: React.ComponentType;
  showInNav?: boolean;
}