import { ExecutorContext } from '@nx/devkit';
import { execSync } from 'child_process';

export default async function runExecutor(
    options: any,
    context: ExecutorContext
  ) {
    const projectName = context.projectName || '';
    const projectRoot = context.projectsConfigurations.projects[projectName].root;
    
    try {
      console.log(`Executing Flutter command in ${projectRoot}...`);
      execSync(`cd ${projectRoot} && ${options.command}`, {
        stdio: 'inherit',
      });
      return { success: true };
    } catch (e) {
      console.error('Failed to execute Flutter command:', e);
      return { success: false };
    }
}