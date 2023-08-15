import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage';

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyServicePipeline',
      crossAccountKeys: true, //allow to use cross keys

       // How it will be built and synthesized
       synth: new ShellStep('Synth', {
         // Where the source can be found -- updating from master to main
         // git branch -m master main
         // git push -u origin main
         input: CodePipelineSource.gitHub('alextorres1980/cdkpipelined-demo', 'main'),
         
         // Install dependencies, build and run cdk synth 
         commands: [
           'npm ci',
           'npm run build',
           'npx cdk synth'
         ],
       }),
    });

    // This is where we add the application stages
    // This is where we add the application stages
    pipeline.addStage(new CdkpipelinesDemoStage(this, 'PreProd', {
      env: { account: '537827199935', region: 'us-west-2' }
    }));
    
    //Add pipeline for account 2
    pipeline.addStage(new CdkpipelinesDemoStage(this, 'Prod', {
      env: { account: '179409628499', region: 'us-east-1' }
    }));
    
    
  }
}