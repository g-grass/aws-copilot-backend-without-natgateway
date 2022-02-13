import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

export class AppRepository {
  private _tableName: string;
  private _region: string;
  constructor() {
    this._tableName = process.env.CREATURES_NAME;
    this._region = 'us-east-1';
  }

  async putItem(name: string, type: string): Promise<string> {
    try {
      const dynamodb = new DynamoDBClient({ region: this._region });
      const client = DynamoDBDocumentClient.from(dynamodb);
      const command = new PutCommand({
        TableName: this._tableName,
        Item: { name, type },
      });
      const results = await client.send(command);
      console.log(results);
      return 'ok';
    } catch (err) {
      console.log(err);
      return 'internal server error';
    }
  }
}
